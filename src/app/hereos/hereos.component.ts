import { Component,OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-hereos';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-hereos',
  templateUrl: './hereos.component.html',
  styleUrls: ['./hereos.component.css']
})

export class HereosComponent implements OnInit {
  heroes : Hero[] = [];


  constructor(private heroService: HeroService){}
 


getHeroes():void{
  this.heroService.getHereos()
      .subscribe(heroes => this.heroes = heroes);
}
ngOnInit():void{
  this.getHeroes();
}
add(name: string): void {
  name = name.trim();
  if (!name) { return; }
  this.heroService.addHero({ name } as Hero)
    .subscribe(hero => {
      this.heroes.push(hero);
    });
}
delete(hero: Hero): void {
  this.heroes = this.heroes.filter(h => h !== hero);
  this.heroService.deleteHero(hero.id).subscribe();
}
}
