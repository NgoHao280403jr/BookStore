import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CategoryService, CategoryDto, } from '@proxy/categories'; 
import { ListService, PagedResultDto } from '@abp/ng.core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  providers: [
    ListService,
  ],
})
export class CategoryComponent implements OnInit {
  category: PagedResultDto<CategoryDto> = {
    items: [],
    totalCount: 0
  };
  form: FormGroup;
  currentCategoryId: string | null = null;

  @ViewChild('CategoryModal', { static: true }) categoryModal; // Tham chiếu đến template modal

  constructor(
    private categoryService: CategoryService,
    public readonly list: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal // Inject modal service
  ) {}

  ngOnInit(): void {
    this.loadCatelogies();
  }

  loadCatelogies(): void {
    const categoryStreamCreator = (query) => this.categoryService.getList(query);
    this.list.hookToQuery(categoryStreamCreator).subscribe(
      (response) => {
        this.category = response;
        this.cd.detectChanges(); // Ensure Angular checks for changes
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu sách:', error);
      }
    );
  }

  openModal(category?: CategoryDto): void {
    this.currentCategoryId = category?.id || null;
    this.buildForm(category);
    this.modalService.open(this.categoryModal, { size: 'lg' });
  }

  buildForm(category?: CategoryDto): void {
    this.form = this.fb.group({
      name: [category?.name || '', Validators.required],
      description: [category?.description || '', Validators.required],
      
      
    });
  }

  save(modal: NgbModalRef): void {
    if (this.form.invalid) {
      return;
    }

    const saveObservable = this.currentCategoryId
      ? this.categoryService.update(this.currentCategoryId, this.form.value)
      : this.categoryService.create(this.form.value);

    saveObservable.subscribe(
      () => {
        this.loadCatelogies();
        modal.close(); // Đóng modal sau khi lưu thành công
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lưu dữ liệu sách:', error);
      }
    );
  }

  deleteCategory(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      this.categoryService.delete(id).subscribe(
        () => {
          this.loadCatelogies();
        },
        (error) => {
          console.error('Có lỗi xảy ra khi xóa sách:', error);
        }
      );
    }
  }
}

