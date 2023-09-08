import { Router } from '../utils/createRouter';
import writeJson from '../utils/writeJson';
import md2html from '../utils/md2html';

type AboutObject = {
  _id: string;
  firstName: string;
  lastName: string;
  description: string;
  scrollText: string;
  email: string;
  githubUrl: string;
  linkedInUrl: string;
};

async function importAboutYou({ contentful }: Router): Promise<void> {
  console.time('Getting information about you');
  const rawData = (await contentful.getEntries(
    'about',
    {}
  )) as Partial<AboutObject>[];
  const aboutYou = await normalizeAboutYou(rawData[0]);
  await writeJson('about.json', aboutYou);
  console.timeEnd('Getting information about you');
}

const normalizeAboutYou = async (
  aboutObj: Partial<AboutObject>
): Promise<AboutObject> => {
  const normalized = {} as AboutObject;
  normalized._id = aboutObj?._id || `${Math.random()}`;
  normalized.firstName = aboutObj?.firstName || '';
  normalized.lastName = aboutObj?.lastName || '';
  normalized.description = await md2html(aboutObj?.description || '');
  normalized.scrollText = aboutObj?.scrollText || '';
  normalized.email = aboutObj?.email || '';
  normalized.githubUrl = aboutObj?.githubUrl || '';
  normalized.linkedInUrl = aboutObj?.linkedInUrl || '';
  return normalized;
};

export default importAboutYou;
