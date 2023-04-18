import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, combineLatest, of,throwError } from 'rxjs';
import { catchError, map, tap,merge, mergeWith,scan, shareReplay,concatMap,combineLatestWith} from 'rxjs';

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
  .get<Hero[]>(this.heroesUrl)



  getHero(id: number) {

this.selectedHeroSubject.next(id)
    
  }

 


  private heroCRUDSubject=new Subject<CRUDAction<Hero>>();
  heroCRUDAction$ = this.heroCRUDSubject.asObservable();

  private heroCRUDCompleteSubject=new Subject<boolean>();
  heroCRUDCompleteAction$ = this.heroCRUDCompleteSubject.asObservable();


  allHeroes$ = merge(
    this.heroes$,
    this.heroCRUDAction$.pipe(
      concatMap((heroAction)=>
         this.saveHeroes(heroAction).pipe(
          map((hero)=>({...heroAction, data:hero}))
         )
      )
    )
  ).pipe(
    scan((heroes, value)=>{
      return this.modifyHeroes(heroes, value)
    }, [] as Hero[])
   
  )
      
    
  
    modifyHeroes(heroes:Hero[],value:Hero[] | { data:Hero; action: 'add' | 'update' | 'delete'; }){
      if(!(value instanceof Array)){
        if(value.action==='add'){
          return [...heroes,value.data]
        }
        if(value.action==='update'){
          return heroes.map((hero)=>
          hero.id === value.data.id ? value.data : hero )
        }
        if(value.action==='delete'){
          return heroes.filter((hero)=>hero.id !== value.data.id)
        }
      }
      else{
        return value
      }
      return heroes
    }
    saveHeroes(heroAction:CRUDAction<Hero>): Observable<Hero>{
      console.log(`save hero ${heroAction}`)
      console.log(heroAction)
      let heroDetails$!:Observable<Hero>

      if(heroAction.action==='add'){
        return this.addHeroToServer(heroAction.data)
        
      }
      if(heroAction.action==='update'){
        
      return this.updateHeroServer(heroAction.data)
        
      }
      if(heroAction.action==='delete'){
        return this.deleteHeroServer(heroAction.data)
        
      }
      return of(heroAction.data)
    }
  
addHeroToServer(hero:Hero){
  return this.http.post<Hero>(
    this.heroesUrl,hero,this.httpOptions
  ).pipe(
    map((hero)=>{
      return hero
    })

  )
}
updateHeroServer(hero: Hero){
   this.http.put<Hero>(
    `${this.heroesUrl}/${hero.id}`,hero,this.httpOptions
  )
  console.log(`update hero server: ${hero}`)
  return of(hero)
}

deleteHeroServer(hero:Hero){
   this.http.delete<Hero>(
    `${this.heroesUrl}/${hero.id}`,
    this.httpOptions
  )
  return of(hero)
}
  addHero(hero: Hero) {
    this.heroCRUDSubject.next({action:'add', data:hero});

  }

  updateHero(hero:Hero){
    this.heroCRUDSubject.next({action:'update', data:hero})
    
  }

  deleteHero(hero:Hero){
    this.heroCRUDSubject.next({action:'delete', data:hero})
  }

  private selectedHeroSubject = new BehaviorSubject<number>(1);
  selectedHeroAction$ = this.selectedHeroSubject.asObservable()

  hero$ = combineLatest([this.heroes$,this.selectedHeroAction$]).pipe(
    map(([heroes,selectedHeroId])=>{
      return heroes.find((hero:Hero)=>hero.id === selectedHeroId)
    })
  )

  selectHero(heroId:number){
    this.selectedHeroSubject.next(heroId)
  }
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      map(heroes => heroes.length ? heroes : []),
      tap(heroes => heroes.length ? 
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)
      ),
      )
  }



  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  }


 


  
//  }