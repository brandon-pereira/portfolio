const { createClient} = require('contentful');

module.exports = class Contentful {

    constructor(auth) {
        this.client = createClient(auth);
    }

    getAllEntries() {
        return this.client.getEntries();
    }

    async getEntries(contentType, query) {
        const entries = await this.client.getEntries({
            'content_type': contentType,
            ...query
        })
        if(entries && entries.items) {
            return entries.items.map(item => this.convertItem(item));
        }
        throw new Error("getEntries didn't return an array!");
    }

    convertItem(_item) {
        const item = {
            _id: _item.sys.id,
            ..._item.fields
        }
        Object.entries(item).forEach(([key, value]) => {
            if(value && Array.isArray(value)) {
                item[key] = value.map((val) => this.convertItem(val));
            }
        });
        return item
    }

}