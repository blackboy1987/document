export interface ResourceListItem {
  id: number;
  name: string;
  items: ResourceItem[];
}

interface ResourceItem {
  id: number;
  name: string;
  title: string;
  createDate: Date;
  downloadHits: number;
  resUrls: string[];
}
