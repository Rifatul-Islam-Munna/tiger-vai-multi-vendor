import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateMeilisearchDto, SearchProductsDto } from './dto/create-meilisearch.dto';
import { UpdateMeilisearchDto } from './dto/update-meilisearch.dto';
import { Index, MeiliSearch } from 'meilisearch';
@Injectable()
export class MeilisearchService implements OnModuleInit{
    private readonly logger = new Logger(MeilisearchService.name);
  private client: MeiliSearch;
  private index:Index<CreateMeilisearchDto>;

  async onModuleInit() {
    try{
      this.client = new MeiliSearch({
      host: 'http://localhost:7700',
      apiKey: 'admin',
    });
    this.index = this.client.index<CreateMeilisearchDto>('short_products');
     const h =  await this.client.health();

    await this.setupIndex();
     this.logger.log('✅ MeiliSearch connected successfully',h.status);
    
    }catch(error){
      this.logger.error('❌ Could not connect to MeiliSearch', error);

    }
    
  }

  private async setupIndex() {
    await this.index.updateFilterableAttributes([
      'category',
      'brandName',
      'main',
      'hasOffer',
      'price',
      'stock',
      'rating',
    ]);

    await this.index.updateSortableAttributes([
      'createdAt',
      'price',
      'stock',
      'rating',
    ]);
  }

  /** 🟢 Create document */
  async create(doc: CreateMeilisearchDto) {
    return this.index.addDocuments([doc]);
  }

  /** 🟡 Update document */
  async update(id: string, updatedData: UpdateMeilisearchDto) {
    return this.index.updateDocuments([{ id, ...updatedData }]);
  }

  /** 🔴 Delete document */
  async delete(id: string) {
    return this.index.deleteDocument(id);
  }

  /** 🔍 Search documents with DTO */
  async search(dto: SearchProductsDto) {
    const {
      q = '',
      category,
      brandName,
      main,
      hasOffer,
      sortBy,
      sortOrder = 'desc',
      limit = 20,
    } = dto;

    const filters: string[] = [];

    if (category) filters.push(`category = "${category}"`);
    if (brandName) filters.push(`brandName = "${brandName}"`);
    if (main) filters.push(`main = "${main}"`);
    if (hasOffer !== undefined) filters.push(`hasOffer = ${hasOffer}`);

    const filterStr = filters.length ? filters.join(' AND ') : undefined;

    const result = await this.index.search(q, {
      filter: filterStr,
      limit,
      sort: sortBy ? [`${sortBy}:${sortOrder}`] : undefined,
      facets: ['category', 'brandName', 'main', 'hasOffer'],
    });

    return {
      total: result.estimatedTotalHits,
      items: result.hits,
      facets: result.facetDistribution || {},
    };
  }
}
