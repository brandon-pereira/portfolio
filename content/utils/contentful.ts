import { createClient, ContentfulClientApi } from "contentful";

class Contentful {
  client: ContentfulClientApi<undefined>;

  constructor(auth: { space: string; accessToken: string }) {
    this.client = createClient(auth);
  }

  async getEntries(
    contentType: string,
    query: { [key: string]: boolean | string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[]> {
    const entries = await this.client.getEntries({
      content_type: contentType,
      ...query,
    });
    if (entries && entries.items) {
      return entries.items.map((item) => this.convertItem(item));
    }
    throw new Error("getEntries didn't return an array!");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  convertItem(_item: any): any {
    const item = {
      _id: _item.sys.id,
      ..._item.fields,
    };
    Object.entries(item).forEach(([key, value]) => {
      if (value && Array.isArray(value)) {
        item[key] = value.map((val) => this.convertItem(val));
      }
    });
    return item;
  }
}

export default Contentful;
