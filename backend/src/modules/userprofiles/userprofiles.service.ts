import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';
import { StudentProfile } from '../../shared/entities/studentProfile.entity.js';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity.js';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity.js';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity.js';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

interface FullUserProfileResponse {
  user: Omit<User, 'password' | 'toJSON'>;
  profile: UserProfile;
  pedago?: StudentProfile | TeacherProfile;
  ordonnance?: StudentOrdonnance | TeacherOrdonnance;
}

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,

    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,

    @InjectRepository(TeacherProfile)
    private readonly teacherProfileRepository: Repository<TeacherProfile>,

    @InjectRepository(StudentOrdonnance)
    private readonly studentOrdonnanceRepository: Repository<StudentOrdonnance>,

    @InjectRepository(TeacherOrdonnance)
    private readonly teacherOrdonnanceRepository: Repository<TeacherOrdonnance>,
  ) {}

  /**
   * Retrieve user profile by user ID.
   */
  async getUserProfile(userId: number): Promise<{ user: Omit<User, 'password' | 'toJSON'>; profile: UserProfile }> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['userProfile'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...restUser } = user;
    return { user: restUser, profile: user.userProfile };
  }

  /**
   * Retrieve full user profile with related data.
   */
  async getFullUserProfile(userId: number): Promise<FullUserProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userProfile',
        'userProfile.studentProfile',
        'userProfile.studentOrdonnance',
        'userProfile.teacherProfile',
        'userProfile.teacherOrdonnance',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...restUser } = user;
    const profile = user.userProfile;
    const pedago = user.role === 'student' ? profile?.studentProfile : profile?.teacherProfile;
    const ordonnance = user.role === 'student' ? profile?.studentOrdonnance : profile?.teacherOrdonnance;

    return {
      user: restUser,
      profile,
      pedago,
      ordonnance,
    };
  }

  /**
   * Retrieve user profile by ID.
   */
  async GetProfileByUserId(userId: number): Promise<UserProfile | null> {
    return this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  /**
   * Create a new user profile.
   */
  async createProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.userProfileRepository.create(data);
    const savedProfile = await this.userProfileRepository.save(profile);

    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['userProfile'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.userProfile = savedProfile;
    await this.userRepository.save(user);
    return savedProfile;
  }

  /**
   * NOT DIRECTLY USED IN CONTROLLER
   * Create a complete empty profile for a new user (including specific profiles for teachers and students).
   */
  async createEmptyProfileFor(user: User): Promise<void> {
    // Créer UserProfile
    const userProfile = new UserProfile();
    const savedUserProfile = await this.userProfileRepository.save(userProfile);

    user.userProfile = savedUserProfile;
    await this.userRepository.save(user);

    // Profils spécifiques
    if (user.role === 'teacher') {
      const teacherProfile = new TeacherProfile();
      teacherProfile.userProfile = savedUserProfile;
      await this.teacherProfileRepository.save(teacherProfile);

      const teacherOrdonnance = new TeacherOrdonnance();
      teacherOrdonnance.userProfile = savedUserProfile;
      await this.teacherOrdonnanceRepository.save(teacherOrdonnance);
    }

    if (user.role === 'student') {
      const studentProfile = new StudentProfile();
      studentProfile.userProfile = savedUserProfile;
      await this.studentProfileRepository.save(studentProfile);

      const studentOrdonnance = new StudentOrdonnance();
      studentOrdonnance.userProfile = savedUserProfile;
      await this.studentOrdonnanceRepository.save(studentOrdonnance);
    }
  }


  /**
   * Update user profile by ID.
   */
  async updateProfile(profileId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }
    Object.assign(profile, data);
    return this.userProfileRepository.save(profile);
  }

  async updateUserProfile(userId: number, data: { user: Partial<User>, profile: Partial<UserProfile> }): Promise<FullUserProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userProfile']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (data.user) {
      Object.assign(user, data.user);
    }

    if (data.profile && user.userProfile) {
      Object.assign(user.userProfile, data.profile);
    }

    await this.userRepository.save(user); // Cascade met à jour userProfile aussi

    return this.getUserProfile(userId);
  }

  /**
   * Update full user profile with related data.
   */
  async updateFullUserProfile(userId: number, data: {
    user: Omit<User, 'password' | 'toJSON'>;
    profile: UserProfile;
    studentProfile?: StudentProfile;
    studentOrdonnance?: StudentOrdonnance;
    teacherProfile?: TeacherProfile;
    teacherOrdonnance?: TeacherOrdonnance;
  }): Promise<FullUserProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userProfile',
        'userProfile.studentProfile',
        'userProfile.studentOrdonnance',
        'userProfile.teacherProfile',
        'userProfile.teacherOrdonnance',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data.user);
    await this.userRepository.save(user);

    return this.getFullUserProfile(userId);
  }

  /**
   * Upload avatar for user profile.
   */
  async uploadAvatar(userId: number, file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const avatarUrl = `/uploads/${file.filename}`;
    const userProfile = await this.GetProfileByUserId(userId);

    if (!userProfile) {
      await this.createProfile(userId, { avatar: avatarUrl });
    } else {
      await this.updateProfile(userProfile.id, { avatar: avatarUrl });
    }
    return avatarUrl;
  }

  /**
   * Delete user profile by user ID.
   */
  async deleteUserProfile(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['userProfile'] });
    if (!user || !user.userProfile) {
      throw new NotFoundException(`UserProfile for user ID ${userId} not found`);
    }

    await this.userProfileRepository.remove(user.userProfile);
  }
}
