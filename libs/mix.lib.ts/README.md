# mixlib

```
public data: PaginationModel<MixPostPortalModel> = new PaginationModel<MixPostPortalModel>();
constructor(public postRepo: PostRepository) {}
  ngOnInit(): void {
    this.postRepo.getListModel(this.params).then(resp => {
      this.data = resp;
    });
  }
```
# testing cicd
