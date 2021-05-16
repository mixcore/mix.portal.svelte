import { MixPortalRepository } from './mix-portal-repository';
export class ViewModelBase {
    /**
     *
     */
    constructor(modelType, model) {
        this.repository = new MixPortalRepository(modelType);
        if (model) {
            this.parseView(model);
        }
    }
    create() {
        const model = this.parseModel();
        return this.repository.createModel(model);
    }
    update() {
        const model = this.parseModel();
        return this.repository.updateModel(this.id, model);
    }
    delete(id) {
        return this.repository.deleteModel(id);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1tb2RlbC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbWl4LmxpYi50cy9zcmMvbGliL2luZnJhc3RydWN0dXJlL2Jhc2Uvdmlldy1tb2RlbC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTlELE1BQU0sT0FBZ0IsYUFBYTtJQUdqQzs7T0FFRztJQUNILFlBQVksU0FBdUIsRUFBRSxLQUFTO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRU0sTUFBTTtRQUNYLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDTSxNQUFNO1FBQ1gsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ00sTUFBTSxDQUFDLEVBQW1CO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUlGIn0=