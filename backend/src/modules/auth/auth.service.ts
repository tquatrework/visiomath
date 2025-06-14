import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../shared/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { UserRelationsService } from '../userrelations/userrelations.service.js';
import { compare } from 'bcrypt';
import { LoginDto } from '../../shared/dto/login.dto.js';

@Injectable()
export class AuthService {
  private invalidatedTokens: Set<string> = new Set();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly userRelationsService: UserRelationsService, 
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      const { password : _password, ...result } = user;
      return result;
    }
    return null;
  }

  //async login(user: any) {
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password); // Valide l'utilisateur

    // Vérification si l'utilisateur est actif
    if (!user.isActive) {
      throw new BadRequestException('L’utilisateur n’est plus actif.'); // Exception si utilisateur inactif
    }

    // Première connexion → créer les relations
    if (!user.hasConnectedOnce) {
      await this.userRelationsService.createInitialRelations(user);
      user.hasConnectedOnce = true;
      await this.usersService.save(user); // ou userRepository.save(user)
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateToken(user: User): Promise<string> {
    const payload = { sub: user.id, role: user.role };
    return this.jwtService.sign(payload); // Génère un JWT avec les données utilisateur
  }

   // Nouvelle méthode pour rafraîchir le jeton
   async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    // Vérifiez le refreshToken ici (par exemple, en le décodant ou en le validant)
    // Supposons que vous ayez une méthode pour valider le refreshToken
    const decoded = this.jwtService.verify(refreshToken); // Assurez-vous d'importer la méthode verify de JwtService
    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Vous pouvez également récupérer l'utilisateur à partir du payload
    const user = await this.usersService.findById(decoded.sub); // Assumez que vous avez une méthode findById

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Générez un nouveau access_token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Gestion de la déconexion et des tokens invalid
  async invalidateToken(token: string): Promise<void> {
    // Ajoutez le token à une liste de tokens invalidés
    this.invalidatedTokens.add(token);
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    return this.invalidatedTokens.has(token);
  }

  async getUserNameChecked(pseudo: string): Promise<boolean> {
    const user = await this.usersService.findByPseudo(pseudo);
    if (user) {
      return true;
    }
    return false;
  } 
}