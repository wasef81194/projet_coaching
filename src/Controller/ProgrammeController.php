<?php

namespace App\Controller;

use App\Entity\Image;
use App\Entity\Programme;
use App\Repository\CategorieRepository;
use App\Repository\ImageRepository;
use App\Repository\ProgrammeRepository;
use App\Repository\RecetteRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ProgrammeController extends AbstractController
{
    #[Route('api/programmes', name: 'app_programmes')]
    public function programmes(ProgrammeRepository $programmeRepository, SerializerInterface $serializer): JsonResponse
    {
        $programmes = $programmeRepository->findBy(['deleted_at' => NULL]);
        $response = $serializer->serialize(
            $programmes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/programmes/user/{idUser}', name: 'app_programmes_user')]
    public function programmesUser($idUser, ProgrammeRepository $programmeRepository, SerializerInterface $serializer): JsonResponse
    {
        $programmes = $programmeRepository->findBy(['deleted_at' => NULL, 'user' => $idUser]);
        $response = $serializer->serialize(
            $programmes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/programmes/recette/{idRecette}', name: 'app_programmes_recette')]
    public function programmeRecette($idRecette, ProgrammeRepository $programmeRepository, SerializerInterface $serializer): JsonResponse
    {
        $programmes = $programmeRepository->findProgrammesByRecette($idRecette);
        $response = $serializer->serialize(
            $programmes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/programmes/user/{idUser}', name: 'app_all_programmes_coach', methods:'GET')]
    public function programmesCoach($idUser, ProgrammeRepository $programmesRepository, SerializerInterface $serializer): JsonResponse
    {
        $programmes = $programmesRepository->findBy(['deleted_at' => NULL, 'user' => $idUser]);
        $response = $serializer->serialize(
            $programmes, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/new/programme', name: 'app_new_programme', methods:'POST')]
    public function new(Request $request, UserRepository $userRepository, RecetteRepository $recetteRepository, CategorieRepository $categorieRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    { //Récupere les données dans un tableau
        $data = json_decode($request->getContent(), true);
        
        $programme = new Programme();

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
        $programme->setUser($user);
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
            $programme->addCategory($categorie);
        }

        if (!empty($data['recettes'])) {
            foreach ($data['recettes'] as $idRecette){
                $recette = $recetteRepository->findOneBy(['id' => $idRecette]);
                $programme->addRecette($recette);
            }
        }
        //Nom
        $name = ucfirst(strtolower($data['name']));
        $programme->setName($name);
        //Description
        $programme->setDescription($data['description']);
        $programme->setCreer(new \DateTime('now'));
        $entityManager->persist($programme);
        $entityManager->flush();

        //Image
        $dataImg  = substr($data['image'], 0, 4);
        if ($dataImg == 'data') {
             $response = ImageController::importImageBase64($data['image'], $this->getParameter('programme_images_directory'));
            //Si l'image a bien été importer
            if($response['code'] == 200){
                 $path = $response['file'];
                 $image = new Image();
                 $image->setProgramme($programme);
                 $image->setCreatedAt(new \DateTime());
                 $image->setDetail('programme');
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
                'message'=> 'Programme ajouté avec succées.'
            ], 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
}
