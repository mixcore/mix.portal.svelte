import axios from 'axios';
import {
  Template,
  TemplateListRequest,
  TemplateListResponse,
  Theme
} from '@/types/template';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mixcore.org';

/**
 * Service for managing templates and themes
 */
export const templateService = {
  /**
   * Get a list of templates based on request parameters
   */
  async getTemplates(
    request: TemplateListRequest
  ): Promise<TemplateListResponse> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/api/v2/portal/template/list`, { params: request });
    // return response.data;

    // Mock data for development
    return {
      items: [
        {
          id: '1',
          fileName: 'Default.cshtml',
          fileFolder: '/templates/pages',
          folderType: 'Pages',
          themeId: '1',
          content: '<h1>@Model.Title</h1>\n<div>@Model.Content</div>',
          scripts: '<script>\n  console.log("Page loaded");\n</script>',
          styles: '<style>\n  body { font-family: sans-serif; }\n</style>',
          lastModified: new Date(),
          createdDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          fileName: 'Blog.cshtml',
          fileFolder: '/templates/posts',
          folderType: 'Posts',
          themeId: '1',
          content:
            '<article>\n  <h1>@Model.Title</h1>\n  <div>@Model.Content</div>\n</article>',
          scripts: '<script>\n  // Blog post script\n</script>',
          styles:
            '<style>\n  article { max-width: 800px; margin: 0 auto; }\n</style>',
          lastModified: new Date(),
          createdDateTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ],
      pagingData: {
        page: request.pageIndex || 0,
        pageSize: request.pageSize || 10,
        total: 2,
        totalPages: 1
      }
    };
  },

  /**
   * Get a single template by ID
   */
  async getTemplate(id: string): Promise<Template> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/api/v2/portal/template/${id}`);
    // return response.data;

    // Mock data for development
    return {
      id,
      fileName: 'Default.cshtml',
      fileFolder: '/templates/pages',
      folderType: 'Pages',
      themeId: '1',
      content: '<h1>@Model.Title</h1>\n<div>@Model.Content</div>',
      scripts: '<script>\n  console.log("Page loaded");\n</script>',
      styles: '<style>\n  body { font-family: sans-serif; }\n</style>',
      lastModified: new Date(),
      createdDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  },

  /**
   * Save a template
   */
  async saveTemplate(template: Template): Promise<Template> {
    // TODO: Replace with actual API call when backend is ready
    // if (template.id) {
    //   const response = await axios.put(`${API_URL}/api/v2/portal/template/${template.id}`, template);
    //   return response.data;
    // } else {
    //   const response = await axios.post(`${API_URL}/api/v2/portal/template`, template);
    //   return response.data;
    // }

    // Mock data for development
    return {
      ...template,
      id: template.id || Math.random().toString(36).substring(2, 9),
      lastModified: new Date()
    };
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    // TODO: Replace with actual API call when backend is ready
    // await axios.delete(`${API_URL}/api/v2/portal/template/${id}`);
    // return true;

    // Mock for development
    return true;
  },

  /**
   * Get all themes
   */
  async getThemes(): Promise<Theme[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/api/v2/portal/theme/list`);
    // return response.data;

    // Mock data for development
    return [
      {
        id: '1',
        name: 'Default Theme',
        thumbnail: '/images/themes/default.jpg',
        version: '1.0.0',
        createdDateTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        assetFolder: '/themes/default'
      },
      {
        id: '2',
        name: 'Modern Theme',
        thumbnail: '/images/themes/modern.jpg',
        version: '1.0.0',
        createdDateTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        isActive: false,
        assetFolder: '/themes/modern'
      }
    ];
  },

  /**
   * Get a theme by ID
   */
  async getTheme(id: string): Promise<Theme> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/api/v2/portal/theme/${id}`);
    // return response.data;

    // Mock data for development
    return {
      id,
      name: 'Default Theme',
      thumbnail: '/images/themes/default.jpg',
      version: '1.0.0',
      createdDateTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      assetFolder: '/themes/default'
    };
  }
};
