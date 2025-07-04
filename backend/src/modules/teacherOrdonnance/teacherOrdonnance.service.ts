import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity';
import { UserProfile } from '../../shared/entities/userprofile.entity';

@Injectable()
export class TeacherOrdonnanceService {
  constructor(
    @InjectRepository(TeacherOrdonnance)
    private readonly teacherOrdonnanceRepository: Repository<TeacherOrdonnance>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Retrieve all teacher ordonnances with optional filters.
   */
  async findAll(profileId?: number): Promise<TeacherOrdonnance[]> {
    if (profileId) {
      const teacherOrdonnance = await this.findByProfileId(profileId);
      return teacherOrdonnance ? [teacherOrdonnance] : [];
    }
    return this.teacherOrdonnanceRepository.find({
      relations: ['userProfile'],
    });
  }

  /**
   * Retrieve a specific teacher ordonnance by ID.
   */
  async findOne(id: number): Promise<TeacherOrdonnance> {
    const ordonnance = await this.teacherOrdonnanceRepository.findOne({
      where: { id },
      relations: ['userProfile'],
    });
    if (!ordonnance) {
      throw new NotFoundException(`TeacherOrdonnance with ID ${id} not found`);
    }
    return ordonnance;
  }

  /**
   * Retrieve a teacher ordonnance by UserProfile ID, or create one if it does not exist.
   */
  async findByProfileId(profileId: number): Promise<TeacherOrdonnance> {
    let teacherOrdonnance = await this.teacherOrdonnanceRepository.findOne({
      where: { userProfile: { id: profileId } },
      relations: ['userProfile'],
    });

    if (!teacherOrdonnance) {
      const userProfile = await this.userProfileRepository.findOne({ where: { id: profileId } });
      if (!userProfile) {
        throw new NotFoundException(`UserProfile with ID ${profileId} not found`);
      }

      teacherOrdonnance = this.teacherOrdonnanceRepository.create({ userProfile });
      await this.teacherOrdonnanceRepository.save(teacherOrdonnance);
    }

    return teacherOrdonnance;
  }

  /**
   * Create a new teacher ordonnance.
   */
  async create(data: Partial<TeacherOrdonnance>): Promise<TeacherOrdonnance> {
    const newOrdonnance = this.teacherOrdonnanceRepository.create(data);
    return this.teacherOrdonnanceRepository.save(newOrdonnance);
  }

  /**
   * Update an existing teacher ordonnance by ID.
   */
  async update(id: number, data: Partial<TeacherOrdonnance>): Promise<TeacherOrdonnance> {
    const ordonnance = await this.findOne(id);
    Object.assign(ordonnance, data);
    return this.teacherOrdonnanceRepository.save(ordonnance);
  }

  /**
   * Delete a teacher ordonnance by ID.
   */
  async delete(id: number): Promise<void> {
    const result = await this.teacherOrdonnanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TeacherOrdonnance with ID ${id} not found`);
    }
  }
}
