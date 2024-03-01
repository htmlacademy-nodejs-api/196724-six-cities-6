import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  UserAuth,
  User,
  Offer,
  Comment,
  CommentAuth,
  FavoriteAuth,
  UserRegister,
  NewOffer,
  LightOffer
} from '../types/types';
import { AppRoute, BaseRoutes, HttpCode} from '../const';
import { Token } from '../utils';
import {OfferDto, OfferLiteDto} from './dtos';
import {commentToClient, commentToDto, lightOfferToClient, offerToClient, offerToDto} from './adapters';
import {CommentDto} from './dtos/commments/index.js';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<LightOffer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferLiteDto[]>(BaseRoutes.Offers);
    return data.map(lightOfferToClient);
  });

export const fetchFavoriteOffers = createAsyncThunk<LightOffer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferLiteDto[]>(`${BaseRoutes.Offers}/favourites`);

    return data.map(lightOfferToClient);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${BaseRoutes.Offers}/${id}`);

      return offerToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<Offer>(`${BaseRoutes.Offers}/create`, offerToDto(newOffer));
    history.push(`${AppRoute.Property}/${data.id}`);

    return data;
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<Offer>(`${BaseRoutes.Offers}/update/${offer.id}`, offerToDto(offer));
    history.push(`${AppRoute.Property}/${data.id}`);

    return data;
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${BaseRoutes.Offers}/delete/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<LightOffer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferLiteDto[]>(`${BaseRoutes.Offers}/premium?city=${cityName}`);
    return data.map(lightOfferToClient);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${BaseRoutes.Comments}/offers/${id}`);

    return data.map(commentToClient);
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<User>(`${BaseRoutes.Users}/check`);

      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{ accessToken: string }>(`${BaseRoutes.Users}/login`, { email, password });
    const { accessToken } = data;

    Token.save(accessToken);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{ id: string }>(`${BaseRoutes.Users}/create`, {
      email,
      password,
      name,
      type,
    });
    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`${BaseRoutes.Users}/${data.id}/avatar`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<CommentDto>(`${BaseRoutes.Comments}/offers/create`, commentToDto({ comment, rating }, id));

    return commentToClient(data);
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.post<User>(`${BaseRoutes.Users}/offers/favourite/add`, { offerId: id });
    const { data } = await api.get<OfferDto>(`${BaseRoutes.Offers}/${id}`);
    return offerToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.delete<Offer>(`${BaseRoutes.Users}/offers/favourite/${id}/remove`);
    const { data } = await api.get<OfferDto>(`${BaseRoutes.Offers}/${id}`);
    return offerToClient(data);

  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
