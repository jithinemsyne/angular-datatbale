import { Component } from '@angular/core';
import { NgxIndexedDbService } from 'src/app/services/ngx-indexed-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isBookmarked: boolean = false;

  constructor(private ngxIndexedDbService: NgxIndexedDbService) { }

  ngOnInit() {
    this.setBookmark();
  }

  /**
   *
   * @author Pradeep V
   * @memberof AboutComponent
   * @description To set the initial condition for bookmark based on value stored in IndexedDB
   */
  setBookmark() {
    this.ngxIndexedDbService.getAllBookmarks().subscribe(bookmarks => {
      const allBookmarks = bookmarks;
      this.isBookmarked = allBookmarks.some(x => x.title === 'Home') ? true : false;
      console.log('isBookmarked home:', this.isBookmarked);
    });
  }

  /**
   *
   * @author Pradeep V
   * @memberof AboutComponent
   * @description To toggle bookmark when user click on bookmark button
   */
  toggleBookmark() {
    this.ngxIndexedDbService.getAllBookmarks().subscribe(bookmarks => {
      const allBookmarks = bookmarks;
      if (!allBookmarks.some(x => x.title === 'Home')) {
        this.ngxIndexedDbService.addBookmark({ title: 'Home', data: 1 }).subscribe(bookmark => {
          console.log('Bookmark added with title:', bookmark.title);
          this.isBookmarked = true;
        });
      } else {
        this.ngxIndexedDbService.deleteBookmark('Home').subscribe(() => {
          console.log('Bookmark deleted');
          this.isBookmarked = false;
        });
      }
    });
  }
}
