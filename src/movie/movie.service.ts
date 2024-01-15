import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/schemas/movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}
  async create(title: string, published_year: number, poster: string) {
    return this.movieModel.insertMany({ title, published_year, poster });
  }

  async update(
    id: string,
    title: string,
    published_year: number,
    poster: string,
  ) {
    const updateObj = { title, published_year, poster };
    if (poster) {
      updateObj[poster] = poster;
    }
    return this.movieModel.updateOne({ _id: id }, updateObj);
  }

  async getMovie(id: string): Promise<any> {
    try {
      return await this.movieModel.findOne({ _id: id }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getAll(
    page: number,
    limit: number,
    sort: string = 'createdAt',
    sortOrder: number = 1, // Asc
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sort] = sortOrder;

      const movies = await this.movieModel
        .find()
        .lean({ virtuals: true })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.movieModel.countDocuments();

      return { movies, total };
    } catch (error) {
      throw error;
    }
  }
}
