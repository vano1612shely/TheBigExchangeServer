import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Review } from "./review.types";
import { Public } from "../guards/decorators/public.decorator";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Post("/")
  async create(@Body() data: Review): Promise<Review> {
    return await this.reviewsService.createReview(data);
  }

  @Public()
  @Get("/")
  async getAll(): Promise<Review[]> {
    return await this.reviewsService.getAll();
  }

  @Public()
  @Get("/byId/:id")
  async getById(@Param("id") id: number): Promise<Review> {
    return await this.reviewsService.getById(Number(id));
  }

  @Public()
  @Get("/lastReviews")
  async getLastReviews() {
    return await this.reviewsService.getLastReviews();
  }

  @Patch("/:id")
  async updateReview() {}

  @Delete("/:id")
  async deleteReview(@Param("id") id: number) {
    return await this.reviewsService.delete(Number(id));
  }
}
