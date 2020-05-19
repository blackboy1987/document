export interface ResourceListItem {
  id: number;
  name: string;
  items: ResourceItem[];
}

interface ResourceItem {
  props: { [key: string]: any };
  id: number;
  name: string;
  title: string;
  createDate: Date;
  downloadHits: number;
  resUrls: string[];
}
