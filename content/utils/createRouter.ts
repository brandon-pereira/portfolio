import Contentful from './contentful';
import AssetManager from './assetManager';

export interface Router {
  contentful: Contentful;
  assetManager: AssetManager;
}

const contentful = new Contentful({
  space: process.env.CONTENTFUL_SPACE || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || ''
});

const assetManager = new AssetManager();

export default (): Router => ({
  contentful,
  assetManager
});
