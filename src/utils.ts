import { diff, Diff } from 'deep-diff';

export const getObjectDifferences = (
  oldObject: any,
  newObject: any,
  omit?: string[],
): Diff[] | null => {
  const difference = diff(oldObject, newObject);

  if (!difference) return null;

  if (omit) {
    const newDifference = difference.filter((diff) => {
      if (!diff.path) return false;
      const path = diff.path.join('.');
      return !omit?.includes(path);
    });

    return newDifference.length ? newDifference : null;
  }

  return difference;
};
