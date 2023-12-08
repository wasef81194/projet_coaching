<?php
namespace App\Controller;

use App\Repository\ImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

class ImageController extends AbstractController
{
    static function importImageBase64($base64, $path){
        //Recupere l'etension de l'image
        $extension = explode('/', mime_content_type($base64))[1];
        if(!in_array($extension, ['png', 'gif', 'jpeg', 'jpg', 'mp4'])){
            return ['code'=> 400, 'message'=> 'Merci d\'importer des images au format png, jpeg ou gif'];
        }
        //Creer l'image dans le bon dossier
        $nameFile = md5(uniqid()).'.'.$extension;
        $outputFile = $path.$nameFile;
        $file = fopen($outputFile, "wb");
        $data = explode(',', $base64);
        fwrite($file, base64_decode($data[1]));
        fclose($file);
        return ['code' => 200 , 'file'=> $nameFile];
    }

    #[Route('api/image/programme/{id}', name: 'app_image_programme', methods:'GET')]
    public function imageProgramme($id, ImageRepository $imageRepository, SerializerInterface $serializer): JsonResponse
    {
        $image = $imageRepository->findOneBy(['programme' => $id, 'deleted_at' => NULL]);
        $response = $serializer->serialize(
            $image, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/image/reccette/{id}', name: 'app_recettes', methods:'GET')]
    public function imageRecette($id = null, ImageRepository $imageRepository, SerializerInterface $serializer): JsonResponse
    {
        $image = $imageRepository->findOneBy(['recette' => $id, 'deleted_at' => NULL]);
        $response = $serializer->serialize(
            $image, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
    

    #[Route('api/image/profil/user/{userId}', name: 'api_image_profil_user')]
    public function profilImage($userId, ImageRepository $imageRepository, SerializerInterface $serializer):JsonResponse
    {
        //On récupere l'image de profil de l'utilisateur
       // $user = $userRepository->find($userId);
        $image = $imageRepository->findOneBy(['user' => $userId, 'detail' => 'profil', 'deleted_at' => NULL]);
        $response = $serializer->serialize(
            $image, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('api/image/cover/user/{userId}', name: 'api_image_cover_user')]
    public function coverImage($userId, ImageRepository $imageRepository, SerializerInterface $serializer):JsonResponse
    {
        //On récupere l'image de couverture de l'utilisateur
        //$user = $userRepository->find($userId);
        $image = $imageRepository->findOneBy(['user' => $userId, 'detail' => 'cover', 'deleted_at' => NULL]);
        $response = $serializer->serialize(
            $image, 'json'
        );
        return new JsonResponse($response, 200, [], true);
    }
}
