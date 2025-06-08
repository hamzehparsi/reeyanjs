// composables/useContentTypes.js
export function useContentTypes() {
  const contentTypesState = useState('contentTypes', () => ({
    contentTypes: [],
    pending: false,
    error: null,
  }));

  async function fetchContentTypes() {
    try {
      contentTypesState.value.pending = true;
      const { data, error } = await useFetch('/api/content-types');
      if (error.value) {
        contentTypesState.value.error = error.value.message;
        contentTypesState.value.contentTypes = [];
      } else {
        contentTypesState.value.contentTypes =
          data.value?.contentTypes?.map((item) => ({
            id: item._id,
            name: item.displayName,
          })) || [];
        contentTypesState.value.error = null;
      }
    } catch (err) {
      contentTypesState.value.error = err.message;
      contentTypesState.value.contentTypes = [];
    } finally {
      contentTypesState.value.pending = false;
    }
  }

  return {
    contentTypesState,
    fetchContentTypes,
  };
}