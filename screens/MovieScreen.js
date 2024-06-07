import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeftIcon, HeartIcon, TrashIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cast from '../components/cast';
import MovieList from '../components/movieList';
import Loading from '../components/loading';
import { fetchMovieReviews, addMovieReview, deleteMovieReview } from '../api/reviews';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500, fallbackMoviePoster } from '../api/moviedb';
import supabase from '../api/Supabase';
import { styles, theme } from '../theme';

const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : ' mt-3';
const { width, height } = Dimensions.get('window');

export default function MovieScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movie, userId } = route.params;  // Pobierz movie i userId z parametrów nawigacji
  const [movieDetails, setMovieDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(movie.id);
    getMovieCredits(movie.id);
    getSimilarMovies(movie.id);
    getReviews(movie.id);
  }, [movie]);

  const getMovieDetails = async (id) => {
    try {
      const data = await fetchMovieDetails(id);
      console.log('got movie details');
      if (data) {
        setMovieDetails({ ...movieDetails, ...data });
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovieCredits = async (id) => {
    try {
      const data = await fetchMovieCredits(id);
      console.log('got movie credits');
      if (data && data.cast) {
        setCast(data.cast);
      }
    } catch (error) {
      console.error('Error fetching movie credits:', error);
    }
  };

  const getSimilarMovies = async (id) => {
    try {
      const data = await fetchSimilarMovies(id);
      console.log('got similar movies');
      if (data && data.results) {
        setSimilarMovies(data.results);
      }
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  const getReviews = async (movieId) => {
    try {
      const data = await fetchMovieReviews(movieId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'You must be logged in to add a review');
        return;
      }

      const newReview = await addMovieReview(userId, movie.id, reviewText, rating);
      if (newReview) {
        setReviews([newReview, ...reviews]);
        setReviewText('');
        setRating(0);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteMovieReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="flex-1 bg-neutral-900">
      <View className="w-full">
        <SafeAreaView className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${topMargin}`}>
          <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon size="35" color={isFavourite ? 'red' : 'white'} />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{ uri: image500(movieDetails.poster_path) || fallbackMoviePoster }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-widest">
          {movieDetails?.title}
        </Text>
        {movieDetails?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {movieDetails?.status} • {movieDetails?.release_date?.split('-')[0] || 'N/A'} • {movieDetails?.runtime} min
          </Text>
        ) : null}
        <View className="flex-row justify-center mx-4 space-x-2">
          {movieDetails?.genres?.map((genre, index) => {
            let showDot = index + 1 !== movieDetails.genres.length;
            return (
              <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                {genre?.name} {showDot ? '•' : null}
              </Text>
            );
          })}
        </View>
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {movieDetails?.overview}
        </Text>
      </View>

      {movieDetails?.id && cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {movieDetails?.id && similarMovies.length > 0 && <MovieList title={'Similar Movies'} hideSeeAll={true} data={similarMovies} userId={userId} />}

      {userId ? (
        <View className="p-4">
          <TextInput
            className="bg-white p-2 mb-2"
            placeholder="Write your review..."
            value={reviewText}
            onChangeText={setReviewText}
          />
          <TextInput
            className="bg-white p-2 mb-2"
            placeholder="Rating (1-5)"
            value={String(rating)}
            onChangeText={text => setRating(Number(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity className="bg-blue-500 p-2 rounded" onPress={handleAddReview}>
            <Text className="text-white text-center">Submit Review</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View className="p-4">
        {reviews.map((review) => (
          <View key={review.id} className="mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-white">{review.profiles.username}</Text>
              <Text className="text-neutral-400">{review.review_text}</Text>
              <Text className="text-yellow-500">{review.rating} / 5</Text>
            </View>
            {userId && review.profiles.id === userId ? (
              <TouchableOpacity onPress={() => handleDeleteReview(review.id)}>
                <TrashIcon size="24" color="red" />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
