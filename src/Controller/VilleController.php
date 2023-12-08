<?php

namespace App\Controller;

use stdClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class VilleController extends AbstractController
{
    #[Route('api/ville/voisin', name: 'get_citys_voisin')]
    static function getVillesVoisin($postalCode, $rayon = 30): stdClass
    {
        $url = "https://www.villes-voisines.fr/getcp.php?cp=$postalCode&rayon=$rayon";
        $villes = file_get_contents($url);
        $villes = json_decode($villes);
        return $villes;
    }
}
