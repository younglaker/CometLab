import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSinglePage } from './news-single.page';

describe('NewsSinglePage', () => {
  let component: NewsSinglePage;
  let fixture: ComponentFixture<NewsSinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSinglePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
