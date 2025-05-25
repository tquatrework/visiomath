import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';

@Injectable()
export class StudentOrdonnanceService {
  constructor(
    @InjectRepository(StudentOrdonnance)
    private readonly studentOrdonnanceRepository: Repository<StudentOrdonnance>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Retrieve all student ordonnances with optional filters.
   */
  async findAll(profileId?: number): Promise<StudentOrdonnance[]> {
    if (profileId) {
      const studentOrdonnance = await this.findByProfileId(profileId);
      return studentOrdonnance ? [studentOrdonnance] : [];
    }
    return this.studentOrdonnanceRepository.find();
  }

  /**
   * Retrieve a specific student ordonnance by ID.
   */
  async findOne(id: number): Promise<StudentOrdonnance> {
    const ordonnance = await this.studentOrdonnanceRepository.findOne({ where: { id } });
    if (!ordonnance) {
      throw new NotFoundException(`StudentOrdonnance with ID ${id} not found`);
    }
    return ordonnance;
  }

  /**
   * Retrieve a student ordonnance by UserProfile ID, or create one if it does not exist.
   */
  async findByProfileId(profileId: number): Promise<StudentOrdonnance> {
    let studentOrdonnance = await this.studentOrdonnanceRepository.findOne({
      where: { userProfile: { id: profileId } },
      relations: ['userProfile'],
    });

    if (!studentOrdonnance) {
      const userProfile = await this.userProfileRepository.findOne({ where: { id: profileId } });
      if (!userProfile) {
        throw new NotFoundException(`UserProfile with ID ${profileId} not found`);
      }

      studentOrdonnance = this.studentOrdonnanceRepository.create({ userProfile });
      await this.studentOrdonnanceRepository.save(studentOrdonnance);
    }

    return studentOrdonnance;
  }

  /**
   * Create a new student ordonnance.
   */
  async create(data: Partial<StudentOrdonnance>): Promise<StudentOrdonnance> {
    const newOrdonnance = this.studentOrdonnanceRepository.create(data);
    return this.studentOrdonnanceRepository.save(newOrdonnance);
  }

  /**
   * Update an existing student ordonnance by ID.
   */
  async update(id: number, data: Partial<StudentOrdonnance>): Promise<StudentOrdonnance> {
    const ordonnance = await this.findOne(id);
    Object.assign(ordonnance, data);
    return this.studentOrdonnanceRepository.save(ordonnance);
  }

  /**
   * Delete a student ordonnance by ID.
   */
  async delete(id: number): Promise<void> {
    const result = await this.studentOrdonnanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`StudentOrdonnance with ID ${id} not found`);
    }
  }
}
