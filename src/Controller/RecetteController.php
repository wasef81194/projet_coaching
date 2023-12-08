<?php

namespace App\Controller;

use App\Entity\Image;
use App\Entity\Recette;
use App\Repository\CategorieRepository;
use App\Repository\ImageRepository;
use App\Repository\IngredientRepository;
use App\Repository\ProgrammeRepository;
use App\Repository\RecetteRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class RecetteController extends AbstractController
{
    #[Route('api/recettes/', name: 'app_all_recettes', methods:'GET')]
    public function recettes(RecetteRepository $recetteRepository, SerializerInterface $serializer): JsonResponse
    {
        $recettes = $recetteRepository->findBy(['deleted_at' => NULL]);
        $response = $serializer->serialize(
            $recettes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/recettes/user/{idUser}', name: 'app_all_recettes_coach', methods:'GET')]
    public function recettesCoach($idUser, RecetteRepository $recetteRepository, SerializerInterface $serializer): JsonResponse
    {
        $recettes = $recetteRepository->findBy(['deleted_at' => NULL, 'user' => $idUser]);
        $response = $serializer->serialize(
            $recettes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/recettes/programme/{idProgramme}', name: 'app_recettes_programme', methods:'GET')]
    public function recettesProgramme($idProgramme, RecetteRepository $recetteRepository, SerializerInterface $serializer): JsonResponse
    {
        $recettes = $recetteRepository->findRecettesByProgramme($idProgramme);
        $response = $serializer->serialize(
            $recettes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/new/recette', name: 'app_new_recette', methods:'POST')]
    public function new(Request $request, EntityManagerInterface $entityManager,ProgrammeRepository $programmeRepository, UserRepository $userRepository, IngredientRepository $ingredientRepository, CategorieRepository $categorieRepository, RecetteRepository $recetteRepository, SerializerInterface $serializer): JsonResponse
    {
        //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);
        
        $recette = new Recette();

        //Si il n'y a pas d'id USER
        $user = $userRepository->findOneBy(['id' => $data['idUser'],'deleted_at' => NULL]);
        if (!$data['idUser'] || !$user) {
            $message = $serializer->serialize(
                [
                    'code' => 400,
                    'message' => 'Erreur d\'identification utilisateur.'
                ], 'json'
            );
            return new JsonResponse($message, 400, [], true);
        }
        $recette->setUser($user);
        //Si un champs obligatoire doit n'est pas remplie
        foreach ($data as $label => $value) {
            if (in_array($label, ['name', 'categories', 'ingredients', 'description', 'duree']) && empty($value)) {
                $message = $serializer->serialize(
                    [
                        'code' => 400,
                        'message' => 'Merci de remplir tous les champs obligatoire.',
                    ], 'json'
                );
                return new JsonResponse($message, 400, [], true);
            }
            else{
                if(is_string($value)){
                    $data[$label] = strip_tags(trim($value));
                }
               
            }
        }
        
        //Categories
        foreach ($data['categories'] as $idCategorie) {
            $categorie = $categorieRepository->findOneBy(['id' => $idCategorie]);
            $recette->addCategory($categorie);
        }

        //Ingredients
        foreach ($data['ingredients'] as $idIngredient) {
            $ingredient = $ingredientRepository->findOneBy(['id' => $idIngredient]);
            $recette->addIngredient($ingredient);
        }

        if (!empty($data['programmes'])) {
            foreach ($data['programmes'] as $idProgramme){
                $programme = $programmeRepository->findOneBy(['id' => $idProgramme]);
                $recette->addProgramme($programme);
            }
        }
        //Nom
        $name = ucfirst(strtolower($data['name']));
        $recette->setName($name);
        //Description
        $recette->setDescription($data['description']);
        //Duree moyen
        $recette->setDureeMoyen($data['duree']);
        $recette->setCreatedAt(new \DateTime('now'));
        $entityManager->persist($recette);
        $entityManager->flush();

        //Image
        $dataImg  = substr($data['image'], 0, 4);
        if ($dataImg == 'data') {
             $response = ImageController::importImageBase64($data['image'], $this->getParameter('recette_images_directory'));
            //Si l'image a bien été importer
            if($response['code'] == 200){
                 $path = $response['file'];
                 $image = new Image();
                 $image->setRecette($recette);
                 $image->setCreatedAt(new \DateTime());
                 $image->setDetail('recette');
                 $image->setPath($path);
                 $entityManager->persist($image);
                 $entityManager->flush();
             }
             else{
                 return new JsonResponse($response['message'], $response['code'], [], true);
             }
        }

        $response = $serializer->serialize(
            [
                'code' => 200,
                'message'=> 'Recette ajouté avec succées.'
            ], 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
    
}
