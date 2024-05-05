"use client";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Review } from "./review.types";

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createReview(data: Review): Promise<Review> {
    if (!data.name) {
      throw new BadRequestException("Name is required");
    }
    if (!data.review) {
      throw new BadRequestException("Review is required");
    }
    if (!data.stars) {
      throw new BadRequestException("Rating is required");
    }

    const review = await this.databaseService.review.create({
      data: {
        name: data.name,
        review: data.review,
        country: data.country,
        stars: data.stars,
        date: data.date ? data.date : new Date(),
      },
    });

    return review;
  }

  async getAll(): Promise<Review[]> {
    const reviews = await this.databaseService.review.findMany({
      orderBy: { date: "desc" },
    });
    return reviews;
  }

  async getById(id: number): Promise<Review> {
    const review = await this.databaseService.review.findUnique({
      where: { id: id },
    });
    return review;
  }

  async getLastReviews(): Promise<Review[]> {
    const reviews = await this.databaseService.review.findMany({
      orderBy: { date: "desc" },
      take: 5,
    });
    return reviews;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.databaseService.review.delete({ where: { id: id } });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
