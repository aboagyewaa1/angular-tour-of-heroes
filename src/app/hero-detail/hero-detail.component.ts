import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Subject, combineLatest } from 'rxjs';
import { tap,map } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent implements OnInit {
  hero$ = this.heroService.hero$.pipe(
    tap((hero)=>{
     this.heroForm.patchValue({
      id: hero?.id,
      name: hero?.name
     })
    })
  )

heroForm = new FormGroup({
  id: new FormControl<number | null>(null),
  name: new FormControl('')
})
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
  onSelectHero(hero:Hero){
    hero.id && this.heroService.selectHero(hero.id)
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
  }

  goBack(): void {
    this.location.back();
  }

  save() {
    // console.log(this.heroForm.value)
    this.heroService.updateHero({...this.heroForm.value} as Hero)
    return this.goBack()
  }
}