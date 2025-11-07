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
    this.client.createIndex('short_products',{
      primaryKey: 'id',
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
      'subMain',
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
    this.logger.log('🟢 Creating document', doc);
      if (!doc.id) {
    throw new Error('Document must have an id field');
  }
   const task = await this.index.addDocuments([doc],{primaryKey:"id"});
   this.logger.log('🟢 Document created', task);
  
  return task;
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
    subMain,
    hasOffer,
    sortBy,
    sortOrder = 'desc',
    limit = 20,
    page = 1,  // ✅ Add page parameter (default: 1)
    minPrice,
    maxPrice, 
  } = dto;

  // ✅ Calculate offset based on page number
  const offset = (page - 1) * limit;

  const filters: string[] = [];

  if (category) filters.push(`category = "${category}"`);
  if (brandName) filters.push(`brandName = "${brandName}"`);
  if (subMain) filters.push(`subMain = "${subMain}"`);
  if (main) filters.push(`main = "${main}"`);
  if (hasOffer !== undefined) filters.push(`hasOffer = ${hasOffer}`);
    
  // ✅ Add price range filter
  if (minPrice !== undefined) filters.push(`price >= ${minPrice}`);
  if (maxPrice !== undefined) filters.push(`price <= ${maxPrice}`);
  const filterStr = filters.length ? filters.join(' AND ') : undefined;

  const result = await this.index.search(q, {
    filter: filterStr,
    limit,
    offset,  // ✅ Add offset for pagination
    sort: sortBy ? [`${sortBy}:${sortOrder}`] : undefined,
    facets: ['category', 'brandName', 'main', 'hasOffer'],
  });

  // ✅ Calculate total pages
  const totalPages = Math.ceil(result.estimatedTotalHits / limit);

  return {
    total: result.estimatedTotalHits,
    items: result.hits,
    facets: result.facetDistribution || {},
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

  async findAll() {
    return this.index.getDocuments();
  }
}
