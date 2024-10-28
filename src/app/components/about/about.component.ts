import { Component } from '@angular/core';
import { NgxIndexedDbService } from 'src/app/services/ngx-indexed-db.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
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
      this.isBookmarked = allBookmarks.some(x => x.title === 'About') ? true : false;
      console.log('isBookmarked about:', this.isBookmarked);
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
      if (!allBookmarks.some(x => x.title === 'About')) {
        this.ngxIndexedDbService.addBookmark({ title: 'About', data: 2 }).subscribe(bookmark => {
          console.log('Bookmark added with title:', bookmark.title);
          this.isBookmarked = true;
        });
      } else {
        this.ngxIndexedDbService.deleteBookmark('About').subscribe(() => {
          console.log('Bookmark deleted');
          this.isBookmarked = false;
        });
      }
    });
  }
}
