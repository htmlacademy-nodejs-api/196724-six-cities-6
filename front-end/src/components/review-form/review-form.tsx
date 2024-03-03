import type { ChangeEvent, FormEvent } from 'react';
import { Fragment, useState, useEffect } from 'react';

import type { NewComment } from '../../types/types';
import { Stars, CommentsConstraint, SubmitStatus } from '../../const';

type ReviewFormProps = {
  onSubmit: (formData: NewComment) => void;
  submitStatus: SubmitStatus;
}

const ReviewForm = ({ onSubmit, submitStatus }: ReviewFormProps) => {
  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const isSubmiting = submitStatus === SubmitStatus.Pending;

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      comment: text,
      rating
    });
  };

  useEffect(() => {
    if (submitStatus === SubmitStatus.Fullfilled) {
      setText('');
      setRating(0);
    }

  }, [submitStatus]);

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleFormSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {Array.from({ length: Stars.count}, (_,i) => (
          <Fragment key={`Star ${Stars.count - i}`}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              defaultValue={Stars.count - i}
              id={`${Stars.count - i}-stars`}
              type="radio"
              checked={Stars.count - i === rating}
              onChange={handleInputChange}
              disabled={isSubmiting}
            />
            <label
              htmlFor={`${Stars.count - i}-stars`}
              className="reviews__rating-label form__rating-label"
            >
              <svg className="form__star-image" width={37} height={33}>
                <use xlinkHref="#icon-star" />
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={text}
        onChange={handleTextareaChange}
        disabled={isSubmiting}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
            To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
            between <b className="reviews__text-amount">{CommentsConstraint.minContentLength} and {CommentsConstraint.maxContentLength} characters</b>.
        </p>
        <button
          disabled={isSubmiting || !rating || (text.length < CommentsConstraint.maxContentLength || text.length > CommentsConstraint.maxContentLength)}
          className="reviews__submit form__submit button"
          type="submit"
        >
            Submit
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
