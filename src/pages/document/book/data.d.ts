export interface ResourceListItem {
  id: number;
  name: string;
  resources: ResourceItem[];
}

interface ResourceItem {
  id: number;
  name: string;
  createDate: Date;
  downloadHits: number;
  resUrls: string[];
}
