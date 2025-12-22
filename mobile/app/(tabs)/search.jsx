import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MealAPI } from "../../services/mealAPI.js"
import { useDebounce } from '../../hooks/useDebounce.js'
import { searchStyles } from '../../assets/styles/serach.styles.js'
import { Ionicons } from '@expo/vector-icons'

import { COLORS } from '../../constants/colors.js'
import RecipeCard from '../../components/RecipeCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

const SearchScreen = () => {

  const [searchQuery, setsearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [recipe, setRecipe] = useState([]);

  const debounceSearchQuery = useDebounce(searchQuery, 300)

  const performSearch = async (query) => {
    if (!query.trim()) {
      const randomMeal = await MealAPI.getRandomMeals(12)
      return randomMeal.map(meal => MealAPI.transformMealData(meal)).filter(meal => meal !== null)
    }

    // search by name first, then by ingredient if no result
    const nameResults = await MealAPI.searchMealsByName(query)
    let results = nameResults
    if (results.length === 0) {
      const ingredientResults = await MealAPI.filterByIngredient(query)
      results = ingredientResults
    }
    return results.slice(0, 12).map(meal => MealAPI.transformMealData(meal)).filter(meal => meal !== null)
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("")
        setRecipe(results)
      } catch (error) {
        console.error("error loading initial data")
      } finally {
        setInitialLoading(false)
      }
    }
    loadInitialData(); // 
  }, [])

  useEffect(() => {
    if (initialLoading) return;
    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debounceSearchQuery)
        setRecipe(results)
      } catch (error) {
        console.error("Error searching", error)
        setRecipe([])
      } finally {
        setLoading(false)
      }
    }
    handleSearch()
  }, [debounceSearchQuery, initialLoading]);

  if (initialLoading) return  <LoadingSpinner message='Loading '/>

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name='search'
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder='Search recipe,ingredient'
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setsearchQuery}
            returnKeyType='search'
          />
          {searchQuery.length> 0 && (
            <TouchableOpacity onPress={()=>setsearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name='close-circle' size={20} color={COLORS.textLight}/>

            </TouchableOpacity>
          )}
          
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>{searchQuery?`Result for"${searchQuery}`:"Popular Recipes"}</Text>
          <Text style={searchStyles.resultsCount}>{recipe.length} found</Text>
        </View>
        {loading?(
        <View style={searchStyles.loadingContainer}>
         <LoadingSpinner message='Searching recipes...' size='small'/>

        </View>
      ):(
        <FlatList data={recipe}
        renderItem={({item})=><RecipeCard recipe={item}/>}
        keyExtractor={(item)=>item.id.toString()}
        numColumns={2}
        columnWrapperStyle={searchStyles.row}
        contentContainerStyle={searchStyles.recipesGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoResultsFound/>}/>
      )}
      </View>
      
    </View>
  )
}

export default SearchScreen

function NoResultsFound(){
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name='search-outline' size={64} color={COLORS.textLight}/>
      <Text style={searchStyles.emptyTitle}>No recipe found</Text>
      <Text style={searchStyles.emptyDescription}>Try adjusting your search or try different keywords</Text>
    </View>
  )
}
