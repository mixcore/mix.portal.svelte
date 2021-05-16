import { MixPostMvc } from '../view-models/mix-post-mvc';
import { MixRestService } from './mix-rest-service';
export declare class PostService extends MixRestService<MixPostMvc> {
    constructor();
    getSingleModel(id: any): Promise<MixPostMvc>;
}
