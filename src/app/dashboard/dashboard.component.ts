import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  // heroes: Hero[] = [];

  heroes$ = this.heroService.heroes$

  constructor(private heroService: HeroService) { }

  // ngOnInit(): void {
  //   this.getHeroes();
  // }

  // getHeroes(): void {
  //   this.heroService.getHeroes()
  //     .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  // }
}