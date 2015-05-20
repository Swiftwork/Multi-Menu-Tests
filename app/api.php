<?php
ini_set('display_errors', 1);

/* Load google drive libraries */
session_start();
set_include_path('assets/lib/'. PATH_SEPARATOR . get_include_path());
require_once 'assets/lib/Google/autoload.php';

/* Load access token generators */
$client = new Google_Client();
$client->setAuthConfigFile('google-config.json');
$client->setScopes(array('https://spreadsheets.google.com/feeds'));

/* Check if current access token is valid else create a new */
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
	$client->setAccessToken($_SESSION['access_token']);
	if($client->isAccessTokenExpired()){
		unset($_SESSION['access_token']);
		$auth_url = $client->createAuthUrl();
		header('Location: ' . filter_var($client->createAuthUrl(), FILTER_SANITIZE_URL));
		exit;
	}
} else {
 	if (isset($_GET['code'])) {
		$client->authenticate($_GET['code']);
		$_SESSION['access_token'] = $client->getAccessToken();
	} else {
		$auth_url = $client->createAuthUrl();
		header('Location: ' . filter_var($client->createAuthUrl(), FILTER_SANITIZE_URL));
		exit;
	}
}
/* Decode token and form data */
$token = json_decode($client->getAccessToken());
$data = json_decode(file_get_contents("php://input"), true);
if (!$data && $token) {
	exit("Successfully connected to google drive with token:<br />" . $token->access_token);
} else if(!$data && !$token) {
	exit("Failed to connect to google drive");
}

/* Start spreadsheet service and select sheet */
use Google\Spreadsheet\DefaultServiceRequest;
use Google\Spreadsheet\ServiceRequestFactory;
use Google\Spreadsheet\SpreadsheetService;

$serviceRequest = new DefaultServiceRequest($token->access_token);
ServiceRequestFactory::setInstance($serviceRequest);

$spreadsheetService = new Google\Spreadsheet\SpreadsheetService();
$spreadsheetFeed = $spreadsheetService->getSpreadsheets();
$spreadsheet = $spreadsheetFeed->getByTitle('MultiMenu Användartester');
$worksheetFeed = $spreadsheet->getWorksheets();
$worksheet = $worksheetFeed->getByTitle('Omgång 1');
$listFeed = $worksheet->getListFeed();

/* Update if exists else insert new */
foreach ($listFeed->getEntries() as $entry) {
	if ($entry->getValues()['id'] == $data['id']) {
		$entry->update($data);
		exit('Updated entry with ID: ' . $data['id']);
	}
}

$listFeed->insert($data);
exit('Added new entry with ID: ' . $data['id']);
?>