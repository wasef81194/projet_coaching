<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use App\Repository\RecetteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class IngredientController extends AbstractController
{
    #[Route('api/ingredients', name: 'app_ingredients')]
    public function ingredients(IngredientRepository $ingredientRepository, SerializerInterface $serializer): JsonResponse
    {
        $ingredients = $ingredientRepository->findBy(['deleted_at' => NULL]);
        $response = $serializer->serialize(
            $ingredients, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/ingredients/recette/{idRecette}', name: 'app_ingredients_recette')]
    public function ingredientsRecette($idRecette, IngredientRepository $ingredientRepository, RecetteRepository $recetteRepository, SerializerInterface $serializer): JsonResponse
    {
        $recette = $recetteRepository->find(['id' => $idRecette]);
        $ingredients = $recette->getIngredients();
        $response = $serializer->serialize(
            $ingredients, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
}
