import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../../shared/entities/studentProfile.entity';
import { UserProfile } from '../../shared/entities/userprofile.entity';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Retrieve all student profiles with optional filters.
   */
  async findAll(profileId?: number): Promise<StudentProfile[]> {
    if (profileId) {
      const studentProfile = await this.findByUserProfileId(profileId);
      return studentProfile ? [studentProfile] : [];
    }
    return this.studentProfileRepository.find({
      relations: ['userProfile'],
    });
  }

  /**
   * Retrieve a specific student profile by ID.
   */
  async findOne(id: number): Promise<StudentProfile> {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { id },
      relations: ['userProfile'],
    });
    if (!studentProfile) {
      throw new NotFoundException(`StudentProfile with ID ${id} not found`);
    }
    return studentProfile;
  }

  /**
   * Retrieve a student profile by UserProfile ID, or create one if it does not exist.
   */
  async findByUserProfileId(profileId: number): Promise<StudentProfile> {
    let studentProfile = await this.studentProfileRepository.findOne({
      where: { userProfile: { id: profileId } },
      relations: ['userProfile'],
    });

    if (!studentProfile) {
      const userProfile = await this.userProfileRepository.findOne({ where: { id: profileId } });
      if (!userProfile) {
        throw new NotFoundException(`UserProfile with ID ${profileId} not found`);
      }

      studentProfile = this.studentProfileRepository.create({ userProfile });
      await this.studentProfileRepository.save(studentProfile);
    }

    return studentProfile;
  }

  /**
   * Create a new student profile.
   */
  async create(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const studentProfile = this.studentProfileRepository.create(data);
    return this.studentProfileRepository.save(studentProfile);
  }

  /**
   * Update an existing student profile by ID.
   */
  async update(id: number, data: Partial<StudentProfile>): Promise<StudentProfile> {
    const studentProfile = await this.findOne(id);
    Object.assign(studentProfile, data);
    return this.studentProfileRepository.save(studentProfile);
  }

  /**
   * Delete a student profile by ID.
   */
  async remove(id: number): Promise<void> {
    const studentProfile = await this.findOne(id);
    await this.studentProfileRepository.remove(studentProfile);
  }
}
