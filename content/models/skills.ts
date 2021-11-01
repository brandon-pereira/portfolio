import { Router } from '../utils/createRouter';
import writeJson from '../utils/writeJson';

type SkillCategory = {
  _id: string;
  name: string;
  skills: Skill[];
  isCategory: boolean;
  isOpen: boolean;
};

type Skill = {
  _id: string;
  name: string;
  description: string;
  skillLevel: 'Pro' | 'Intermediate' | 'Novice';
};

async function importSkills({ contentful }: Router): Promise<void> {
  console.time('Getting skills');
  const rawData = (await contentful.getEntries('skills', {
    'fields.isCategory': true,
    order: 'sys.createdAt'
  })) as SkillCategory[];
  const skills = await normalizeSkills(rawData);
  await writeJson('skills.json', skills);
  console.timeEnd('Getting skills');
}

const normalizeSkills = (categories: SkillCategory[]): SkillCategory[] => {
  return categories
    .map(category => {
      if (!category.skills || !Array.isArray(category.skills)) {
        category.skills = [];
      }
      return category;
    })
    .sort((a, b) => b.skills.length - a.skills.length);
};

export default importSkills;
