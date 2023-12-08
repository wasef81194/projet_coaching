<?php

namespace App\Controller;

use App\Repository\CategorieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class CategorieController extends AbstractController
{
    #[Route('api/categories/recette', name: 'app_categories_recette')]
    public function recetteCategories(CategorieRepository $categorieRepository, SerializerInterface $serializer): JsonResponse
    {
        $categories = $categorieRepository->findBy(['deleted_at' => NULL, 'isRecette' => 1]);
        $response = $serializer->serialize(
            $categories, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/categories/programme', name: 'app_categories_recette')]
    public function programmeCategories(CategorieRepository $categorieRepository, SerializerInterface $serializer): JsonResponse
    {
        $categories = $categorieRepository->findBy(['deleted_at' => NULL, 'isProgramme' => 1]);
        $response = $serializer->serialize(
            $categories, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
}
