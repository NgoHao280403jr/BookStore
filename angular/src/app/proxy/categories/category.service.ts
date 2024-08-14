import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './models';
import type { ListResultDto } from '@abp/ng.core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Default';

  constructor(private restService: RestService) {}

  create = (input: CreateCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/Categories',
      body: input,
    },
    { apiName: this.apiName, ...config });

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/Categories/${id}`,
    },
    { apiName: this.apiName, ...config });

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'GET',
      url: `/api/Categories/${id}`,
    },
    { apiName: this.apiName, ...config });

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ListResultDto<CategoryDto>>({
      method: 'GET',
      url: '/api/Categories',
    },
    { apiName: this.apiName, ...config });

  update = (id: string, input: UpdateCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/Categories/${id}`,
      body: input,
    },
    { apiName: this.apiName, ...config });
}
