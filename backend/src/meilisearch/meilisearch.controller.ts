import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';
import { CreateMeilisearchDto } from './dto/create-meilisearch.dto';
import { UpdateMeilisearchDto } from './dto/update-meilisearch.dto';

@Controller('meilisearch')
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  
}
