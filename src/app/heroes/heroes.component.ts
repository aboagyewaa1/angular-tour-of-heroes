import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, concat, map, toArray } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesComponent {
  heroes$: Observable<Hero[]> = this.heroService.allHeroes$;
  // heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  // ngOnInit(): void {
  //  this.heroes$;
  // }

  // getHeroes(): void {
  //   this.heroService.getHeroes();
  //   .subscribe(heroes => this.heroes = heroes);
  // }

  onAddHero(name: string): void {
    // name = name.trim();
    // console.log(name);

    // if (name) {
    //   this.heroService.addHero({ name } as Hero);
    //   this.heroes$ = this.heroes$.pipe(
    //     map((heroes) => {
    //       heroes.push({ name } as Hero);
    //       return heroes;
    //     })
    //   );
    // }
    this.heroService.addHero({name} as Hero)
    // console.log(this.heroes$)
  }

  onDeleteHero(hero: Hero): void {
    this.heroService.deleteHero(hero)
    // this.heroes$ = this.heroes$.pipe(
    //   map((heroes) => heroes.filter((h) => h !== hero))
    // );
  }
}
