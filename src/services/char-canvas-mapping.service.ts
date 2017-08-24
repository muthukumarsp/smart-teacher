import { Injectable } from '@angular/core';

import { TAMIL_CHAR_MAPPINGS } from './tamil-char-canvas-mapping';
@Injectable()
export class CharCanvasMappingService {
    getCharMappings(): any {
        return TAMIL_CHAR_MAPPINGS;
    }
}