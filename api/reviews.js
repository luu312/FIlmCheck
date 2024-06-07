import supabase from './Supabase';

// Funkcja do pobierania recenzji dla danego filmu
export const fetchMovieReviews = async (movie_id) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        review_text,
        rating,
        created_at,
        profiles (id, username)
      `)
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false });
  
    if (error) {
      throw error;
    }
  
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Funkcja do dodawania recenzji
export const addMovieReview = async (user_id, movie_id, review_text, rating) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        { user_id, movie_id, review_text, rating }
      ])
      .select(`
        id,
        review_text,
        rating,
        created_at,
        profiles (id, username)
      `);

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
};

// Funkcja do usuwania recenzji
export const deleteMovieReview = async (review_id) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review_id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error deleting review:', error);
    return null;
  }
};
