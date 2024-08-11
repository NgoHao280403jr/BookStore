import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BookService, BookDto, bookTypeOptions } from '@proxy/books'; 
import { ListService, PagedResultDto } from '@abp/ng.core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [
    ListService,
  ],
})
export class BookComponent implements OnInit {
  book: PagedResultDto<BookDto> = {
    items: [],
    totalCount: 0
  };
  form: FormGroup;
  bookTypes = bookTypeOptions;
  currentBookId: string | null = null;

  @ViewChild('bookModal', { static: true }) bookModal; // Tham chiếu đến template modal

  constructor(
    private bookService: BookService,
    public readonly list: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal // Inject modal service
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const bookStreamCreator = (query) => this.bookService.getList(query);
    this.list.hookToQuery(bookStreamCreator).subscribe(
      (response) => {
        this.book = response;
        this.cd.detectChanges(); // Ensure Angular checks for changes
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu sách:', error);
      }
    );
  }

  openModal(book?: BookDto): void {
    this.currentBookId = book?.id || null;
    this.buildForm(book);
    this.modalService.open(this.bookModal, { size: 'lg' });
  }

  buildForm(book?: BookDto): void {
    this.form = this.fb.group({
      name: [book?.name || '', Validators.required],
      type: [book?.type || '', Validators.required],
      publishDate: [book?.publishDate ? new Date(book.publishDate) : null, Validators.required],
      price: [book?.price || 0, [Validators.required, Validators.min(0)]],
    });
  }

  save(modal: NgbModalRef): void {
    if (this.form.invalid) {
      return;
    }

    const saveObservable = this.currentBookId
      ? this.bookService.update(this.currentBookId, this.form.value)
      : this.bookService.create(this.form.value);

    saveObservable.subscribe(
      () => {
        this.loadBooks();
        modal.close(); // Đóng modal sau khi lưu thành công
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lưu dữ liệu sách:', error);
      }
    );
  }

  deleteBook(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      this.bookService.delete(id).subscribe(
        () => {
          this.loadBooks();
        },
        (error) => {
          console.error('Có lỗi xảy ra khi xóa sách:', error);
        }
      );
    }
  }

  getBookTypeName(value: number): string | undefined {
    return this.bookTypes.find(type => type.value === value)?.key;
  }
}
