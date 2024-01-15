import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { MovieService } from './movie.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFile() file, @Body() body: any) {
    const response = await this.movieService.create(
      body.title,
      body.published_year,
      file.path,
    );

    return response;
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @UploadedFile() file,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    const response = await this.movieService.update(
      id,
      body.title,
      body.published_year,
      file?.path,
    );

    return response;
  }

  @Get()
  async getMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('sortOrder') sortOrder: number,
  ): Promise<any> {
    const { movies, total } = await this.movieService.getAll(
      page,
      limit,
      sort,
      sortOrder,
    );

    return {
      data: movies,
      total,
    };
  }

  @Get(':id')
  async getMovie(@Param('id') id: string): Promise<any> {
    const movie = await this.movieService.getMovie(id);

    return {
      data: movie,
    };
  }
}
