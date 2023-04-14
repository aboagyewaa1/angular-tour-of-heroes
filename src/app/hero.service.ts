import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, of,throwError } from 'rxjs';
import { catchError, map, tap,merge, mergeWith,scan, shareReplay} from 'rxjs/operators';

import { CRUDAction, Hero } from './hero';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes'; 

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { 
      this.http = http;
    }

  heroes$ = this.http
  .get<{[id:number]:Hero}>(this.heroesUrl)
  .pipe(map((posts)=>{
    let heroesData:Hero[]=[]
    for (let id in posts){
      heroesData.push({...posts[id]})
    }
    return heroesData
  }),



)
  

  // heroes$: Observable<Hero[]> = this.http
  // .get<{[id:number]:Observable<Hero>}>(this.heroesUrl)
  // .pipe(tap(console.log));

 


  // getHeroes(): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  //     .pipe(
  //       tap(_ => this.log('fetched heroes')),
  //       catchError(this.handleError<Hero[]>('getHeroes', []))
  //     );
  // }
 


  // getHeroNo404<Data>(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/?id=${id}`;
  //   return this.http.get<Hero[]>(url)
  //     .pipe(
  //       map(heroes => heroes[0]), 
  //       tap(h => {
  //         const outcome = h ? 'fetched' : 'did not find';
  //         this.log(`${outcome} hero id=${id}`);
  //       }),
  //       catchError(this.handleError<Hero>(`getHero id=${id}`))
  //     );
  // }


  // getHero(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.get<Hero>(url).pipe(
  //     tap(_ => this.log(`fetched hero id=${id}`)),
  //     catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }

 
  // searchHeroes(term: string): Observable<Hero[]> {
  //   if (!term.trim()) {
     
  //     return of([]);
  //   }
  //   return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
  //     tap(x => x.length ?
  //        this.log(`found heroes matching "${term}"`) :
  //        this.log(`no heroes matching "${term}"`)),
  //     catchError(this.handleError<Hero[]>('searchHeroes', []))
  //   );
  // }

  private heroCRUDSubject=new Subject<CRUDAction<Hero>>();
  heroCRUDAction$ = this.heroCRUDSubject.asObservable();

  private heroCRUDCompleteSubject=new Subject<boolean>();
  heroCRUDCompleteAction$ = this.heroCRUDCompleteSubject.asObservable();

    modifyHeroes(heroes:Hero[],value:Hero[] | CRUDAction<Hero>){
      if(!(value instanceof Array)){
        if(value.action==='add'){
          return [...heroes,value.data]
        }
        if(value.action==='update'){
          return heroes.map((hero)=>
          hero.id === value.data.id?value.data:hero)
        }
        if(value.action==='delete'){
          return heroes.filter((hero)=>hero.id!==value.data.id)
        }
      }
      else{
        return value
      }
      return heroes
    }
    saveHeroes(heroAction:CRUDAction<Hero>){
      let heroDetails$!:Observable<Hero>

      if(heroAction.action==='add'){
        heroDetails$=this.addHeroToServer(heroAction.data).pipe(
          tap((hero)=>{
            this.heroCRUDCompleteSubject.next(true);
            console.log('hii');
          }),
          catchError(this.handleError<Hero>('addHero'))
          )
        
      }
      if(heroAction.action==='update'){
        heroDetails$=this.updateHeroServer(heroAction.data).pipe(
          tap((hero)=>{
            this.heroCRUDCompleteSubject.next(true);
            console.log('hii');
          }),
          catchError(this.handleError<Hero>('updateHero'))
          )
        
      }
      if(heroAction.action==='delete'){
        return this.deleteHeroServer(heroAction.data).pipe(
          tap((hero)=>{
            this.heroCRUDCompleteSubject.next(true);
            console.log('hii');
          }),
          catchError(this.handleError<Hero>('deleteHero'))
          )
        
      }
      return heroDetails$.pipe(
        map((heroes)=>{
          
        })
      )
    }
  
addHeroToServer(hero:Hero){
  return this.http.post<Hero>(
    this.heroesUrl,hero,this.httpOptions
  ).pipe(
    map(()=>{
      return{
        ...hero
        

      }
    })

  )
}
updateHeroServer(hero:Hero){
  return this.http.patch<Hero>(
    `${this.heroesUrl}/${hero.id}.json`,hero
  )
}

deleteHeroServer(hero:Hero){
  return this.http.delete(
    `${this.heroesUrl}/${hero.id}.json`
  )
}
  addHero(hero: Hero) {
    this.heroCRUDSubject.next({action:'add', data:hero});
    // console.log(hero)
    // return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
  }

  updateHero(hero:Hero){
    this.heroCRUDSubject.next({action:'update',data:hero})
  }

  deleteHero(hero:Hero){
    this.heroCRUDSubject.next({action:'delete',data:hero})
  }


  // deleteHero(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;

  //   return this.http.delete<Hero>(url, this.httpOptions).pipe(
  //     tap(_ => this.log(`deleted hero id=${id}`)),
  //     catchError(this.handleError<Hero>('deleteHero'))
  //   );
  // }


  // updateHero(hero: Hero): Observable<any> {
  //   return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
  //     tap(_ => this.log(`updated hero id=${hero.id}`)),
  //     catchError(this.handleError<any>('updateHero'))
  //   );
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
   
  //  handleError() {
  

      
  //     console.error('error'); 

   
  //   };
  }

 
  // private log(message: string) {
  //   console.log(message);
  //   this.messageService.add(`HeroService: ${message}`);
  // }

  
// }