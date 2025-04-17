/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  image: string;
}

export interface UpdateUserDto {
  _id: string;
  name: string;
  phone: string;
  address: string;
  image: string;
}

export type CreateLikeDto = object;

export type UpdateLikeDto = object;

export type CreateMenuDto = object;

export type UpdateMenuDto = object;

export type CreateMenuItemDto = object;

export type UpdateMenuItemDto = object;

export type CreateMenuItemOptionDto = object;

export type UpdateMenuItemOptionDto = object;

export type CreateOrderDto = object;

export type UpdateOrderDto = object;

export type CreateOrderDetailDto = object;

export type UpdateOrderDetailDto = object;

export type CreateRestaurantDto = object;

export type UpdateRestaurantDto = object;

export type CreateReviewDto = object;

export type UpdateReviewDto = object;

export interface CreateAuthDto {
  email: string;
  password: string;
  name: string;
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title NestJS API
 * @version 1.0.0
 * @contact
 *
 * Powered by QV
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags App
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  users = {
    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerCreate
     * @request POST:/users
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindAll
     * @request GET:/users
     */
    usersControllerFindAll: (
      query: {
        current: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdate
     * @request PATCH:/users
     */
    usersControllerUpdate: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindOne
     * @request GET:/users/{id}
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerRemove
     * @request DELETE:/users/{id}
     */
    usersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  likes = {
    /**
     * No description
     *
     * @tags Likes
     * @name LikesControllerCreate
     * @request POST:/likes
     */
    likesControllerCreate: (data: CreateLikeDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/likes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Likes
     * @name LikesControllerFindAll
     * @request GET:/likes
     */
    likesControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/likes`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Likes
     * @name LikesControllerFindOne
     * @request GET:/likes/{id}
     */
    likesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/likes/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Likes
     * @name LikesControllerUpdate
     * @request PATCH:/likes/{id}
     */
    likesControllerUpdate: (id: string, data: UpdateLikeDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/likes/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Likes
     * @name LikesControllerRemove
     * @request DELETE:/likes/{id}
     */
    likesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/likes/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  menus = {
    /**
     * No description
     *
     * @tags Menus
     * @name MenusControllerCreate
     * @request POST:/menus
     */
    menusControllerCreate: (data: CreateMenuDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menus`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menus
     * @name MenusControllerFindAll
     * @request GET:/menus
     */
    menusControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menus`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menus
     * @name MenusControllerFindOne
     * @request GET:/menus/{id}
     */
    menusControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menus/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menus
     * @name MenusControllerUpdate
     * @request PATCH:/menus/{id}
     */
    menusControllerUpdate: (id: string, data: UpdateMenuDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menus/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menus
     * @name MenusControllerRemove
     * @request DELETE:/menus/{id}
     */
    menusControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menus/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  menuItems = {
    /**
     * No description
     *
     * @tags MenuItems
     * @name MenuItemsControllerCreate
     * @request POST:/menu-items
     */
    menuItemsControllerCreate: (data: CreateMenuItemDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-items`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItems
     * @name MenuItemsControllerFindAll
     * @request GET:/menu-items
     */
    menuItemsControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-items`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItems
     * @name MenuItemsControllerFindOne
     * @request GET:/menu-items/{id}
     */
    menuItemsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-items/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItems
     * @name MenuItemsControllerUpdate
     * @request PATCH:/menu-items/{id}
     */
    menuItemsControllerUpdate: (id: string, data: UpdateMenuItemDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-items/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItems
     * @name MenuItemsControllerRemove
     * @request DELETE:/menu-items/{id}
     */
    menuItemsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-items/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  menuItemOptions = {
    /**
     * No description
     *
     * @tags MenuItemOptions
     * @name MenuItemOptionsControllerCreate
     * @request POST:/menu-item-options
     */
    menuItemOptionsControllerCreate: (data: CreateMenuItemOptionDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-item-options`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItemOptions
     * @name MenuItemOptionsControllerFindAll
     * @request GET:/menu-item-options
     */
    menuItemOptionsControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-item-options`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItemOptions
     * @name MenuItemOptionsControllerFindOne
     * @request GET:/menu-item-options/{id}
     */
    menuItemOptionsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-item-options/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItemOptions
     * @name MenuItemOptionsControllerUpdate
     * @request PATCH:/menu-item-options/{id}
     */
    menuItemOptionsControllerUpdate: (
      id: string,
      data: UpdateMenuItemOptionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/menu-item-options/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MenuItemOptions
     * @name MenuItemOptionsControllerRemove
     * @request DELETE:/menu-item-options/{id}
     */
    menuItemOptionsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/menu-item-options/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  orders = {
    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerCreate
     * @request POST:/orders
     */
    ordersControllerCreate: (data: CreateOrderDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerFindAll
     * @request GET:/orders
     */
    ordersControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerFindOne
     * @request GET:/orders/{id}
     */
    ordersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerUpdate
     * @request PATCH:/orders/{id}
     */
    ordersControllerUpdate: (id: string, data: UpdateOrderDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerRemove
     * @request DELETE:/orders/{id}
     */
    ordersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orders/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  orderDetail = {
    /**
     * No description
     *
     * @tags OrderDetail
     * @name OrderDetailControllerCreate
     * @request POST:/order-detail
     */
    orderDetailControllerCreate: (data: CreateOrderDetailDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/order-detail`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderDetail
     * @name OrderDetailControllerFindAll
     * @request GET:/order-detail
     */
    orderDetailControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/order-detail`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderDetail
     * @name OrderDetailControllerFindOne
     * @request GET:/order-detail/{id}
     */
    orderDetailControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/order-detail/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderDetail
     * @name OrderDetailControllerUpdate
     * @request PATCH:/order-detail/{id}
     */
    orderDetailControllerUpdate: (
      id: string,
      data: UpdateOrderDetailDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/order-detail/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderDetail
     * @name OrderDetailControllerRemove
     * @request DELETE:/order-detail/{id}
     */
    orderDetailControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/order-detail/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  restaurants = {
    /**
     * No description
     *
     * @tags Restaurants
     * @name RestaurantsControllerCreate
     * @request POST:/restaurants
     */
    restaurantsControllerCreate: (data: CreateRestaurantDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/restaurants`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Restaurants
     * @name RestaurantsControllerFindAll
     * @request GET:/restaurants
     */
    restaurantsControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/restaurants`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Restaurants
     * @name RestaurantsControllerFindOne
     * @request GET:/restaurants/{id}
     */
    restaurantsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/restaurants/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Restaurants
     * @name RestaurantsControllerUpdate
     * @request PATCH:/restaurants/{id}
     */
    restaurantsControllerUpdate: (
      id: string,
      data: UpdateRestaurantDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/restaurants/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Restaurants
     * @name RestaurantsControllerRemove
     * @request DELETE:/restaurants/{id}
     */
    restaurantsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/restaurants/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  reviews = {
    /**
     * No description
     *
     * @tags Reviews
     * @name ReviewsControllerCreate
     * @request POST:/reviews
     */
    reviewsControllerCreate: (data: CreateReviewDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reviews`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reviews
     * @name ReviewsControllerFindAll
     * @request GET:/reviews
     */
    reviewsControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reviews`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reviews
     * @name ReviewsControllerFindOne
     * @request GET:/reviews/{id}
     */
    reviewsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reviews/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reviews
     * @name ReviewsControllerUpdate
     * @request PATCH:/reviews/{id}
     */
    reviewsControllerUpdate: (id: string, data: UpdateReviewDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reviews/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reviews
     * @name ReviewsControllerRemove
     * @request DELETE:/reviews/{id}
     */
    reviewsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reviews/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerHandleLogin
     * @request POST:/auth/login
     */
    authControllerHandleLogin: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerHandleRegister
     * @request POST:/auth/register
     */
    authControllerHandleRegister: (data: CreateAuthDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyEmail
     * @request GET:/auth/verify-email
     */
    authControllerVerifyEmail: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-email`,
        method: 'GET',
        ...params,
      }),
  };
}
