import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
selectedHeroSubject = new Subject<number>();

selectedHeroId=1;
  
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
   
    // const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    // console.log(id)
    // this.heroService.getHero(id)
    
    //   .subscribe(hero => this.hero = hero);
    //   console.log(this.heroService.getHero(id))
    //   console.log(this.hero)
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    // if (this.hero) {
    //   this.heroService.updateHero(this.hero)
    //     .subscribe(() => this.goBack());
    // }
  }
}