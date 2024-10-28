import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxIndexedDbService {

  constructor(private dbService: NgxIndexedDBService) { }

  /**
   *
   * @author Pradeep V
   * @param {{ title: string; data: number }} bookmark
   * @return {*}  {Observable<any>}
   * @memberof NgxIndexedDbService
   * @description To add a new bookmark
   */
  addBookmark(bookmark: { title: string; data: number }): Observable<any> {
    return this.dbService.add('bookmarks', bookmark);
  }

  /**
   *
   * @author Pradeep V
   * @param {string} title
   * @return {*}  {Observable<any>}
   * @memberof NgxIndexedDbService
   * @description To get a bookmark by title
   */
  getBookmarkByTitle(title: string): Observable<any> {
    return this.dbService.getByKey('bookmarks', title);
  }

  /**
   *
   * @author Pradeep V
   * @return {*}  {Observable<any[]>}
   * @memberof NgxIndexedDbService
   * @description To get all bookmarks by
   */
  getAllBookmarks(): Observable<any[]> {
    return this.dbService.getAll('bookmarks');
  }

  /**
   *
   * @author Pradeep V
   * @param {string} title
   * @return {*}  {Observable<any>}
   * @memberof NgxIndexedDbService
   * @description To delete a bookmark by title
   */
  deleteBookmark(title: string): Observable<any> {
    return this.dbService.delete('bookmarks', title);
  }
}
