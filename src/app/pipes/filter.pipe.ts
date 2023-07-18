import { Pipe, PipeTransform } from '@angular/core';
import { CardData } from '../models/card';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: CardData[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter((it) => {
      return it.operacaoPadraoReferencia.toLowerCase().includes(searchText);
    });
  }
}
